class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        k = 0                                   # next write position
        for x in nums:
            if x != val:                        # keep it
                nums[k] = x
                k += 1
        return k
