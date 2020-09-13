import random

all_users = dict()

MIN_USERS_PER_CHAT = 3
WANTED_USERS_PER_CHAT = 4


def add_user(user_id, category):
    if category not in all_users:
        all_users[category] = set().copy()
    all_users[category].add(user_id)


def sample(category):
    groups = list()
    users = list(all_users[category])
    random.shuffle(users)
    num_small_groups = -1
    for i in range(WANTED_USERS_PER_CHAT):
        if i * MIN_USERS_PER_CHAT <= len(users) and (len(users) - i * MIN_USERS_PER_CHAT) % WANTED_USERS_PER_CHAT == 0:
            num_small_groups = i
    if num_small_groups == -1:
        groups.append(users)
    else:
        for i in range(num_small_groups):
            groups.append(users[i * MIN_USERS_PER_CHAT: (i + 1) * MIN_USERS_PER_CHAT])
        users_in_small_groups = num_small_groups * MIN_USERS_PER_CHAT
        for i in range((len(users) - users_in_small_groups) // WANTED_USERS_PER_CHAT):
            groups.append(users[users_in_small_groups + i * WANTED_USERS_PER_CHAT:
                                users_in_small_groups + (i + 1) * WANTED_USERS_PER_CHAT])
