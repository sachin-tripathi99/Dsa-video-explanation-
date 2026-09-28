class Solution:
    def findMaxForm(self, strs: List[str], m: int, n: int) -> int:
        cost = [(s.count("0"), s.count("1")) for s in strs]

        def best(i, z, o):
            if i == len(strs):
                return 0
            res = best(i + 1, z, o)             # skip
            zs, os = cost[i]
            if zs <= z and os <= o:
                res = max(res, 1 + best(i + 1, z - zs, o - os))   # take
            return res

        return best(0, m, n)
