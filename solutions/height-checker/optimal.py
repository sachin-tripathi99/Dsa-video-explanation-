class Solution:
    def heightChecker(self, heights: List[int]) -> int:
        count = [0] * 101
        for h in heights:
            count[h] += 1
        mismatches, cur = 0, 1                     # cur = current expected height
        for h in heights:
            while count[cur] == 0:                 # next height in sorted order
                cur += 1
            if h != cur:
                mismatches += 1
            count[cur] -= 1
        return mismatches
