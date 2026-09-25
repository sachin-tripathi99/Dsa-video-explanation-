import random

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        target, lo, hi = len(nums) - k, 0, len(nums) - 1
        while True:
            pivot = nums[random.randint(lo, hi)]
            lt, i, gt = lo, lo, hi                 # three-way partition
            while i <= gt:
                if nums[i] < pivot:
                    nums[lt], nums[i] = nums[i], nums[lt]
                    lt += 1
                    i += 1
                elif nums[i] > pivot:
                    nums[gt], nums[i] = nums[i], nums[gt]
                    gt -= 1
                else:
                    i += 1
            if target < lt:
                hi = lt - 1                        # answer is on the left
            elif target > gt:
                lo = gt + 1                        # answer is on the right
            else:
                return pivot                       # target is among the pivots
