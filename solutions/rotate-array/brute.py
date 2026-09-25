class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        n = len(nums)
        for _ in range(k % n):
            last = nums[-1]
            for i in range(n - 1, 0, -1):     # shift right by one
                nums[i] = nums[i - 1]
            nums[0] = last
