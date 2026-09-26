class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> out = new ArrayList<>();
        for (int mask = 0; mask < (1 << 2 * n); mask++) {
            StringBuilder sb = new StringBuilder();
            int bal = 0;
            boolean ok = true;
            for (int i = 0; i < 2 * n; i++) {
                boolean open = (mask >> i & 1) == 1;
                sb.append(open ? '(' : ')');
                bal += open ? 1 : -1;
                if (bal < 0) ok = false;
            }
            if (ok && bal == 0) out.add(sb.toString());     // balanced
        }
        return out;
    }
}
