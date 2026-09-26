class Solution:
    def sortColors(self, nums: List[int]) -> None:
        count = [0, 0, 0]
        for x in nums:
            count[x] += 1
        k = 0
        for c in range(3):
            for _ in range(count[c]):
                nums[k] = c
                k += 1
