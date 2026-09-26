class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        String best = "";
        for (int i = 0; i < s.length(); i++) {
            int[] have = new int[128];
            for (int j = i; j < s.length(); j++) {
                have[s.charAt(j)]++;
                if (covers(have, need)) {
                    if (best.isEmpty() || j - i + 1 < best.length()) best = s.substring(i, j + 1);
                    break;
                }
            }
        }
        return best;
    }

    private boolean covers(int[] have, int[] need) {
        for (int c = 0; c < 128; c++) if (have[c] < need[c]) return false;
        return true;
    }
}
