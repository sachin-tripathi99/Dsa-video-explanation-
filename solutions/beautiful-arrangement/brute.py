from itertools import permutations

class Solution:
    def countArrangement(self, n: int) -> int:
        return sum(1 for p in permutations(range(1, n + 1))       # every permutation
                   if all(x % i == 0 or i % x == 0 for i, x in enumerate(p, 1)))
