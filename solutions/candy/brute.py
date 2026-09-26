class Solution:
    def candy(self, ratings: List[int]) -> int:
        n = len(ratings)
        c = [1] * n
        changed = True
        while changed:                          # sweep until stable
            changed = False
            for i in range(n):
                if i > 0 and ratings[i] > ratings[i - 1] and c[i] <= c[i - 1]:
                    c[i] = c[i - 1] + 1
                    changed = True
                if i + 1 < n and ratings[i] > ratings[i + 1] and c[i] <= c[i + 1]:
                    c[i] = c[i + 1] + 1
                    changed = True
        return sum(c)
