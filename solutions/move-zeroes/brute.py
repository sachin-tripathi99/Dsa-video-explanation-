class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        tmp = [x for x in nums if x != 0]
        tmp += [0] * (len(nums) - len(tmp))
        nums[:] = tmp
