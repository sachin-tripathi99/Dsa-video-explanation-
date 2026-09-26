class Solution:
    def sumSubarrayMins(self, arr: List[int]) -> int:
        total = 0
        for i in range(len(arr)):
            m = float("inf")
            for j in range(i, len(arr)):
                m = min(m, arr[j])
                total += m
        return total % 1_000_000_007
