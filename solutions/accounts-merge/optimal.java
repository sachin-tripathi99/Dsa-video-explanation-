class Solution {
    private int[] parent;

    private int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    public List<List<String>> accountsMerge(List<List<String>> accounts) {
        int n = accounts.size();
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        Map<String, Integer> owner = new HashMap<>();          // email → first account with it
        for (int i = 0; i < n; i++)
            for (int k = 1; k < accounts.get(i).size(); k++) {
                String e = accounts.get(i).get(k);
                Integer j = owner.putIfAbsent(e, i);
                if (j != null) parent[find(i)] = find(j);
            }
        Map<Integer, TreeSet<String>> groups = new HashMap<>();
        for (Map.Entry<String, Integer> en : owner.entrySet())
            groups.computeIfAbsent(find(en.getValue()), r -> new TreeSet<>()).add(en.getKey());
        List<List<String>> out = new ArrayList<>();
        for (Map.Entry<Integer, TreeSet<String>> g : groups.entrySet()) {
            List<String> row = new ArrayList<>();
            row.add(accounts.get(g.getKey()).get(0));
            row.addAll(g.getValue());
            out.add(row);
        }
        return out;
    }
}
