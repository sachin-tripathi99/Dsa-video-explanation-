class Solution:
    def reverseWords(self, s: str) -> str:
        a = list(s)
        w = 0                                  # compact: single spaces, none at the ends
        for i, c in enumerate(a):
            if c != " ":
                if w > 0 and a[i - 1] == " ":
                    a[w] = " "
                    w += 1
                a[w] = c
                w += 1
        a = a[:w]

        def reverse(lo: int, hi: int) -> None:
            while lo < hi:
                a[lo], a[hi] = a[hi], a[lo]
                lo += 1
                hi -= 1

        reverse(0, len(a) - 1)                 # reverse everything
        start = 0
        for i in range(len(a) + 1):            # reverse each word back
            if i == len(a) or a[i] == " ":
                reverse(start, i - 1)
                start = i + 1
        return "".join(a)
