class Solution {
    public List<List<String>> accountsMerge(List<List<String>> accounts) {
        List<String> names = new ArrayList<>();
        List<Set<String>> sets = new ArrayList<>();
        for (List<String> a : accounts) {
            names.add(a.get(0));
            sets.add(new HashSet<>(a.subList(1, a.size())));
        }
        boolean merged = true;
        while (merged) {
            merged = false;
            outer:
            for (int i = 0; i < sets.size(); i++)
                for (int j = i + 1; j < sets.size(); j++)
                    if (!Collections.disjoint(sets.get(i), sets.get(j))) {
                        sets.get(i).addAll(sets.get(j));
                        sets.remove(j);
                        names.remove(j);
                        merged = true;
                        break outer;                    // start over after every merge
                    }
        }
        List<List<String>> out = new ArrayList<>();
        for (int i = 0; i < sets.size(); i++) {
            List<String> row = new ArrayList<>(new TreeSet<>(sets.get(i)));
            row.add(0, names.get(i));
            out.add(row);
        }
        return out;
    }
}
