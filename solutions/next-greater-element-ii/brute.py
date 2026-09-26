class Solution:
    def nextGreaterElements(self, nums: List[int]) -> List[int]:
        n = len(nums)
        ans = [-1] * n
        for i in range(n):
            for k in range(1, n):
                if nums[(i + k) % n] > nums[i]:
                    ans[i] = nums[(i + k) % n]
                    break
        return ans
