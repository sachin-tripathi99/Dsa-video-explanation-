class Solution:
    def calculateMinimumHP(self, dungeon: List[List[int]]) -> int:
        R, C = len(dungeon), len(dungeon[0])
        need = [float("inf")] * (C + 1)
        need[C - 1] = 1                         # after the princess: 1 health
        for r in range(R - 1, -1, -1):
            for c in range(C - 1, -1, -1):
                need[c] = max(1, min(need[c], need[c + 1]) - dungeon[r][c])   # min(down, right)
        return need[0]
