import random

class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        def quick_sort(lo: int, hi: int) -> None:
            while lo < hi:
                pivot = nums[random.randint(lo, hi)]
                lt, i, gt = lo, lo, hi     # nums[lo:lt] < pivot, nums[gt+1:hi+1] > pivot
                while i <= gt:
                    if nums[i] < pivot:
                        nums[lt], nums[i] = nums[i], nums[lt]
                        lt += 1; i += 1
                    elif nums[i] > pivot:
                        nums[gt], nums[i] = nums[i], nums[gt]
                        gt -= 1
                    else:
                        i += 1
                # recurse into the smaller side, loop on the larger (keeps the stack O(log n))
                if lt - lo < hi - gt:
                    quick_sort(lo, lt - 1); lo = gt + 1
                else:
                    quick_sort(gt + 1, hi); hi = lt - 1

        quick_sort(0, len(nums) - 1)
        return nums
