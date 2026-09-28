class Solution:
    def rob(self, nums: List[int]) -> int:
        if len(nums) == 1:
            return nums[0]

        def line(a):                            # House Robber on a straight street
            prev2 = prev1 = 0
            for x in a:
                prev2, prev1 = prev1, max(prev1, prev2 + x)
            return prev1

        return max(line(nums[:-1]), line(nums[1:]))   # drop last / drop first
