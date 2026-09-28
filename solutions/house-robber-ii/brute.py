class Solution:
    def rob(self, nums: List[int]) -> int:
        n = len(nums)
        if n == 1:
            return nums[0]

        def best(lo, i):                        # most from houses lo..i
            if i < lo:
                return 0
            return max(best(lo, i - 1), best(lo, i - 2) + nums[i])

        return max(best(0, n - 2), best(1, n - 1))   # drop last / drop first
