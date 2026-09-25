class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        left, right = 0, len(numbers) - 1
        while left < right:
            s = numbers[left] + numbers[right]
            if s == target:
                return [left + 1, right + 1]
            if s > target:
                right -= 1   # too big: the largest can't be used
            else:
                left += 1    # too small: the smallest can't be used
        return [-1, -1]
