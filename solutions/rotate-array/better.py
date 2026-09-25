class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        n = len(nums)
        out = [0] * n
        for i, x in enumerate(nums):
            out[(i + k) % n] = x               # final position of nums[i]
        nums[:] = out
