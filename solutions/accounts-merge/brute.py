class Solution:
    def accountsMerge(self, accounts: List[List[str]]) -> List[List[str]]:
        names = [a[0] for a in accounts]
        sets = [set(a[1:]) for a in accounts]
        merged = True
        while merged:
            merged = False
            for i in range(len(sets)):
                for j in range(i + 1, len(sets)):
                    if sets[i] & sets[j]:
                        sets[i] |= sets.pop(j)
                        names.pop(j)
                        merged = True
                        break                           # start over after every merge
                if merged:
                    break
        return [[name] + sorted(s) for name, s in zip(names, sets)]
