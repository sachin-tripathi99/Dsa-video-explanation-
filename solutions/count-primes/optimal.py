class Solution:
    def countPrimes(self, n: int) -> int:
        if n < 3:
            return 0
        is_prime = [True] * n
        is_prime[0] = is_prime[1] = False
        p = 2
        while p * p < n:
            if is_prime[p]:
                is_prime[p * p:n:p] = [False] * len(range(p * p, n, p))  # cross out multiples
            p += 1
        return sum(is_prime)
