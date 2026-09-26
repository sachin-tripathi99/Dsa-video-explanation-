class Solution {
    public List<List<Integer>> combinationSum3(int k, int n) {
        List<List<Integer>> out = new ArrayList<>();
        for (int mask = 0; mask < (1 << 9); mask++) {
            if (Integer.bitCount(mask) != k) continue;
            int sum = 0;
            List<Integer> c = new ArrayList<>();
            for (int i = 0; i < 9; i++) if ((mask >> i & 1) == 1) { sum += i + 1; c.add(i + 1); }
            if (sum == n) out.add(c);
        }
        return out;
    }
}
