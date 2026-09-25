from itertools import permutations

class Solution:
    def largestNumber(self, nums: List[int]) -> str:
        best = max("".join(p) for p in permutations(map(str, nums)))  # equal lengths → string compare
        return "0" if best[0] == "0" else best
