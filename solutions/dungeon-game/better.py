from functools import cache

class Solution:
    def calculateMinimumHP(self, dungeon: List[List[int]]) -> int:
        R, C = len(dungeon), len(dungeon[0])

        @cache                                  # each room solved once
        def need(r, c):
            if r >= R or c >= C:
                return float("inf")
            nxt = 1 if (r, c) == (R - 1, C - 1) else min(need(r + 1, c), need(r, c + 1))
            return max(1, nxt - dungeon[r][c])

        return need(0, 0)
