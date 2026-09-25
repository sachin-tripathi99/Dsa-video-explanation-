class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        tmp = [0] * len(nums)                   # one buffer, reused by every merge

        def merge_sort(lo: int, hi: int) -> None:
            if lo >= hi:
                return
            mid = (lo + hi) // 2
            merge_sort(lo, mid)
            merge_sort(mid + 1, hi)
            i, j, k = lo, mid + 1, lo
            while i <= mid and j <= hi:
                if nums[i] <= nums[j]:
                    tmp[k] = nums[i]; i += 1
                else:
                    tmp[k] = nums[j]; j += 1
                k += 1
            while i <= mid:
                tmp[k] = nums[i]; i += 1; k += 1
            while j <= hi:
                tmp[k] = nums[j]; j += 1; k += 1
            nums[lo:hi + 1] = tmp[lo:hi + 1]

        merge_sort(0, len(nums) - 1)
        return nums
