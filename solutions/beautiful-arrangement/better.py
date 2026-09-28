class Solution:
    def countArrangement(self, n: int) -> int:
        used = [False] * (n + 1)

        def place(pos):
            if pos > n:
                return 1
            total = 0
            for x in range(1, n + 1):
                if not used[x] and (x % pos == 0 or pos % x == 0):   # only numbers that fit
                    used[x] = True
                    total += place(pos + 1)
                    used[x] = False
            return total

        return place(1)
