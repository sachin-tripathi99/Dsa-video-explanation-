class Solution:
    def findTheWinner(self, n: int, k: int) -> int:
        friends = list(range(1, n + 1))
        idx = 0
        while len(friends) > 1:
            idx = (idx + k - 1) % len(friends)   # k-th friend, counting the start
            friends.pop(idx)                     # next count starts at this index
        return friends[0]
