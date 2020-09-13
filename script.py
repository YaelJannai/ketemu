import random

all_users = dict()

MIN_USERS_PER_GROUP = 3
WANTED_USERS_PER_CHAT = 4

MAX_TRIES = 10


class NoNewGroupAvailable(Exception):
    pass


class NotEnoughUsersForGroup(Exception):
    pass


class User:
    def __init__(self, user_id):
        self.user_id = user_id
        self.previous_group_ids = set()

    def add_group(self, group_ids):
        self.previous_group_ids.add(group_ids)


def add_user(user_id, category):
    if category not in all_users:
        all_users[category] = dict()
    all_users[category][user_id] = User(user_id)


def sample(category):
    groups = list()
    users = list(all_users[category].items())
    random.shuffle(users)
    num_small_groups = -1
    for i in range(WANTED_USERS_PER_CHAT):
        if i * MIN_USERS_PER_GROUP <= len(users) and \
                (len(users) - i * MIN_USERS_PER_GROUP) % WANTED_USERS_PER_CHAT == 0:
            num_small_groups = i
    if num_small_groups == -1:
        if len(users) < MIN_USERS_PER_GROUP:
            raise NotEnoughUsersForGroup(f"There are only {len(users)} in the current category, and the minimal "
                                         f"number of users in a group is {MIN_USERS_PER_GROUP}")
        for i in range(1, len(users) - 1):
            if verify_group(users, max_known=i):
                groups.append(list(zip(*users))[0])
                break
        else:
            raise NoNewGroupAvailable("All available users have already talked to each other")
    else:
        for i in range(num_small_groups):
            cur_group = users[i * MIN_USERS_PER_GROUP: (i + 1) * MIN_USERS_PER_GROUP]
            if verify_group(cur_group):
                groups.append(list(zip(*cur_group))[0])
            else:
                for _ in range(MAX_TRIES - 1):
                    users[i * MIN_USERS_PER_GROUP:] = random.sample(users[i * MIN_USERS_PER_GROUP:],
                                                                    len(users[i * MIN_USERS_PER_GROUP:]))
                    cur_group = users[i * MIN_USERS_PER_GROUP: (i + 1) * MIN_USERS_PER_GROUP]
                    if verify_group(cur_group):
                        groups.append(list(zip(*cur_group))[0])
                        break
                else:
                    raise NoNewGroupAvailable("All available users have already talked to each other")
        users_in_small_groups = num_small_groups * MIN_USERS_PER_GROUP
        for i in range((len(users) - users_in_small_groups) // WANTED_USERS_PER_CHAT):
            cur_group = users[users_in_small_groups + i * WANTED_USERS_PER_CHAT:
                              users_in_small_groups + (i + 1) * WANTED_USERS_PER_CHAT]
            if verify_group(cur_group):
                groups.append(cur_group)
            else:
                for _ in range(MAX_TRIES - 1):
                    users[users_in_small_groups + i * WANTED_USERS_PER_CHAT:] = \
                        random.sample(users[users_in_small_groups + i * WANTED_USERS_PER_CHAT:],
                                      len(users[users_in_small_groups + i * WANTED_USERS_PER_CHAT:]))
                    cur_group = users[users_in_small_groups + i * WANTED_USERS_PER_CHAT:
                                      users_in_small_groups + (i + 1) * WANTED_USERS_PER_CHAT]
                    if verify_group(cur_group):
                        groups.append(cur_group)
                        break
                else:
                    raise NoNewGroupAvailable("All available users have already talked to each other")
            groups.append(cur_group)


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
