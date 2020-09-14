import copy
import json
import os
import random
import sys

USERS_JSON_PATH = './users.json'

all_users = dict()

MIN_USERS_PER_GROUP = 3
WANTED_USERS_PER_CHAT = 4

MAX_TRIES = 20


class NoNewGroupAvailable(Exception):
    pass


class NotEnoughUsersForGroup(Exception):
    pass


class User:
    def __init__(self, user_id):
        self.user_id = user_id
        self.previous_group_ids = set()

    def add_group(self, group_id):
        self.previous_group_ids.add(group_id)

    def __repr__(self):
        return f'user_id: {self.user_id}; previous_group_ids: [' + ','.join(self.previous_group_ids) + ']'

    @classmethod
    def from_dict(cls, dict_obj):
        user = User(dict_obj['user_id'])
        for group_id in dict_obj['previous_group_ids']:
            user.add_group(group_id)
        return user

    def to_dict(self):
        """Serializes this instance to a Python dictionary."""
        output = copy.deepcopy(self.__dict__)
        output['previous_group_ids'] = list(output['previous_group_ids'])
        return output


def add_user(user_id, category):
    if category not in all_users:
        all_users[category] = dict()
    all_users[category][user_id] = User(user_id)


def verify_group(group, max_known=1):
    for i, u1 in enumerate(group):
        known = 0
        for j, u2 in enumerate(group):
            if i == j:
                continue
            if not u1[1].previous_group_ids.isdisjoint(u2[1].previous_group_ids):
                known += 1
        if known > max_known:
            return False
    return True


def load_json(path=USERS_JSON_PATH):
    global all_users
    if not os.path.exists(path):
        raise FileNotFoundError(f"No users file can be found at {path}")
    with open(path, 'r') as f:
        all_users = json.load(f)
    for category in all_users:
        for user_id in all_users[category]:
            all_users[category][user_id] = User.from_dict(all_users[category][user_id])


def save_json(path=USERS_JSON_PATH):
    output = copy.deepcopy(all_users)
    for category in output:
        for user_id in output[category]:
            output[category][user_id] = output[category][user_id].to_dict()

    with open(path, 'w') as f:
        json.dump(output, f)


def sample(category):
    for j in range(MAX_TRIES):
        try:
            groups = dict()
            users = list(all_users[category].items())
            random.shuffle(users)
            num_small_groups = -1
            for i in range(WANTED_USERS_PER_CHAT):
                if i * MIN_USERS_PER_GROUP <= len(users) and \
                        (len(users) - i * MIN_USERS_PER_GROUP) % WANTED_USERS_PER_CHAT == 0:
                    num_small_groups = i
            if num_small_groups == -1:
                if len(users) < MIN_USERS_PER_GROUP:
                    raise NotEnoughUsersForGroup(
                        f"There are only {len(users)} in the current category, and the minimal "
                        f"number of users in a group is {MIN_USERS_PER_GROUP}")
                group_id = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=12))
                for i in range(1, len(users) - 2):
                    if verify_group(users, max_known=i):
                        groups[group_id] = list(zip(*users))[0]
                        break
                else:
                    raise NoNewGroupAvailable("All available users have already talked to each other")
            else:
                for i in range(num_small_groups):
                    group_id = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=12))
                    cur_group = users[i * MIN_USERS_PER_GROUP: (i + 1) * MIN_USERS_PER_GROUP]
                    if verify_group(cur_group):
                        groups[group_id] = list(zip(*cur_group))[0]
                    else:
                        for _ in range(MAX_TRIES - 1):
                            users[i * MIN_USERS_PER_GROUP:] = random.sample(users[i * MIN_USERS_PER_GROUP:],
                                                                            len(users[i * MIN_USERS_PER_GROUP:]))
                            cur_group = users[i * MIN_USERS_PER_GROUP: (i + 1) * MIN_USERS_PER_GROUP]
                            if verify_group(cur_group):
                                groups[group_id] = list(zip(*cur_group))[0]
                                break
                        else:
                            raise NoNewGroupAvailable("All available users have already talked to each other")
                users_in_small_groups = num_small_groups * MIN_USERS_PER_GROUP
                for i in range((len(users) - users_in_small_groups) // WANTED_USERS_PER_CHAT):
                    group_id = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=12))
                    cur_group = users[users_in_small_groups + i * WANTED_USERS_PER_CHAT:
                                      users_in_small_groups + (i + 1) * WANTED_USERS_PER_CHAT]
                    if verify_group(cur_group):
                        groups[group_id] = list(zip(*cur_group))[0]
                    else:
                        for _ in range(MAX_TRIES - 1):
                            users[users_in_small_groups + i * WANTED_USERS_PER_CHAT:] = \
                                random.sample(users[users_in_small_groups + i * WANTED_USERS_PER_CHAT:],
                                              len(users[users_in_small_groups + i * WANTED_USERS_PER_CHAT:]))
                            cur_group = users[users_in_small_groups + i * WANTED_USERS_PER_CHAT:
                                              users_in_small_groups + (i + 1) * WANTED_USERS_PER_CHAT]
                            if verify_group(cur_group):
                                groups[group_id] = list(zip(*cur_group))[0]
                                break
                        else:
                            raise NoNewGroupAvailable("All available users have already talked to each other")
            for group_id, group_users in groups.items():
                for user_id in group_users:
                    all_users[category][user_id].add_group(group_id)
            return groups
        except NoNewGroupAvailable:
            if j == MAX_TRIES - 1:
                raise


def initialize_users(users_json_path):
    """
    :param users_json_path: A path to a list of JSON objects, each representing a user.
    """
    global all_users
    all_users = dict()
    print('************************* 3 *************************')  # TODO: delete this line
    with open(users_json_path, 'r', encoding='utf8') as f:
        print('************************* 4 *************************')  # TODO: delete this line
        users = json.loads('[' + ','.join([x.strip() for x in f.readlines()]) + ']')
        print('************************* 5 *************************')  # TODO: delete this line

    print('************************* 6 *************************')  # TODO: delete this line
    # users = json.loads(users_json)
    for user in users:
        user_id = user['id']
        category = f"{user['studies']['fields'][0]} {user['studies']['year']}"
        add_user(user_id, category)
    print('************************* 7 *************************')  # TODO: delete this line
    save_json()
    print('************************* 8 *************************')  # TODO: delete this line


def get_groups():
    all_groups = list()
    load_json()
    for category in all_users:
        all_groups.extend(sample(category))
    save_json()
    return json.dumps(all_groups)


def main(argv):
    print(f'*********** {argv} ********')  # TODO: delete this line
    print('**** 1.25 ****')  # TODO: delete this line
    print('******** 1 ********')  # TODO: delete this line
    argv = argv[1:]
    print('************************* 1.5 *************************')  # TODO: delete this line
    if argv[0] == 'init':
        print('************************* 2 *************************')  # TODO: delete this line
        initialize_users(argv[1])
    elif argv[0] == 'get_groups':
        return get_groups()
    print('************************* 2.5 *************************')  # TODO: delete this line


if __name__ == "__main__":
    main(sys.argv)
    # print(sys.argv)
    # for k in range(40):
    #     add_user(k, random.randint(0, 1))
    #
    # x = sample(0)
    # y = sample(0)
    # print(1)
