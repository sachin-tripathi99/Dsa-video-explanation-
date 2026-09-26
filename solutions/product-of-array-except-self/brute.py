class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        out = []
        for i in range(len(nums)):
            p = 1
            for j, x in enumerate(nums):
                if j != i:
                    p *= x
            out.append(p)
        return out
