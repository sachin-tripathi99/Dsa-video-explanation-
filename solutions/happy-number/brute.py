class Solution:
    def isHappy(self, n: int) -> bool:
        def step(x):
            return sum(int(d) ** 2 for d in str(x))

        seen = set()
        while n != 1 and n not in seen:
            seen.add(n)
            n = step(n)
        return n == 1
