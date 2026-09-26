class Solution:
    def minDays(self, bloomDay: List[int], m: int, k: int) -> int:
        if m * k > len(bloomDay):
            return -1

        def count(day):
            run = n = 0
            for x in bloomDay:
                if x <= day:
                    run += 1
                    if run == k:
                        n += 1
                        run = 0
                else:
                    run = 0
            return n

        for day in sorted(set(bloomDay)):
            if count(day) >= m:
                return day
        return -1
