from bisect import bisect_left

class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        n = len(numbers)
        for i in range(n):
            need = target - numbers[i]
            j = bisect_left(numbers, need, i + 1, n)  # binary search in numbers[i+1:]
            if j < n and numbers[j] == need:
                return [i + 1, j + 1]
        return [-1, -1]
