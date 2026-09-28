class Solution:
    def rob(self, nums: List[int]) -> int:
        def best(i):                            # most money from houses 0..i
            if i < 0:
                return 0
            return max(best(i - 1), best(i - 2) + nums[i])   # skip or rob house i
        return best(len(nums) - 1)
