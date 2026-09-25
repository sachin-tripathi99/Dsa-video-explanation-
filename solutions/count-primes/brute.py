class Solution:
    def countPrimes(self, n: int) -> int:
        count = 0
        for x in range(2, n):
            d = 2
            while d * d <= x:
                if x % d == 0:
                    break
                d += 1
            else:
                count += 1          # no divisor found
        return count
