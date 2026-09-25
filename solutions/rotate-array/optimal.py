class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        n = len(nums)
        k %= n

        def reverse(lo: int, hi: int) -> None:
            while lo < hi:
                nums[lo], nums[hi] = nums[hi], nums[lo]
                lo += 1
                hi -= 1

        reverse(0, n - 1)    # whole array
        reverse(0, k - 1)    # first k
        reverse(k, n - 1)    # the rest
