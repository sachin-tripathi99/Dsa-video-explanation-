class Solution:
    def findNumberOfLIS(self, nums: List[int]) -> int:
        best = [0, 0]                           # length, count

        def walk(i, prev, length):              # every increasing subsequence
            if i == len(nums):
                if length > best[0]:
                    best[0], best[1] = length, 1
                elif length == best[0]:
                    best[1] += 1
                return
            if nums[i] > prev:
                walk(i + 1, nums[i], length + 1)   # take
            walk(i + 1, prev, length)           # skip

        walk(0, float("-inf"), 0)
        return best[1]
