class Solution:
    def findMaxLength(self, nums: List[int]) -> int:
        first = {0: -1}                         # balance 0 before the array starts
        run = best = 0
        for i, x in enumerate(nums):
            run += 1 if x else -1
            if run in first:
                best = max(best, i - first[run])
            else:
                first[run] = i                  # keep only the first index
        return best
