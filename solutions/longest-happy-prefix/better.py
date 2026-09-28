class Solution:
    def longestPrefix(self, s: str) -> str:
        MOD, B = 1_000_000_007, 131
        n = len(s)
        pre = suf = best = 0
        pw = 1
        for k in range(1, n):
            pre = (pre * B + ord(s[k - 1])) % MOD      # append on the right
            suf = (ord(s[n - k]) * pw + suf) % MOD     # prepend on the left
            pw = pw * B % MOD
            if pre == suf:
                best = k
        return s[:best]
