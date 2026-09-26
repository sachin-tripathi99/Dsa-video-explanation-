class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        out = [1] * n
        p = 1
        for i in range(n):                      # left products
            out[i] = p
            p *= nums[i]
        p = 1
        for i in range(n - 1, -1, -1):          # times right products
            out[i] *= p
            p *= nums[i]
        return out
