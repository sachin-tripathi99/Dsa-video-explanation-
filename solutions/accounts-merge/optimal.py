class Solution:
    def accountsMerge(self, accounts: List[List[str]]) -> List[List[str]]:
        parent = list(range(len(accounts)))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        owner = {}                                  # email → first account with it
        for i, acc in enumerate(accounts):
            for e in acc[1:]:
                if e in owner:
                    parent[find(i)] = find(owner[e])
                else:
                    owner[e] = i

        groups = defaultdict(list)
        for e, i in owner.items():
            groups[find(i)].append(e)
        return [[accounts[r][0]] + sorted(es) for r, es in groups.items()]
