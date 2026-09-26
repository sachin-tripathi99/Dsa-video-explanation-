class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> out = new ArrayList<>();
        for (int mask = 0; mask < (1 << n); mask++) {
            if (Integer.bitCount(mask) != k) continue;      // wrong size
            List<Integer> c = new ArrayList<>();
            for (int i = 0; i < n; i++) if ((mask >> i & 1) == 1) c.add(i + 1);
            out.add(c);
        }
        return out;
    }
}
