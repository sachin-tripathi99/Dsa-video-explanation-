class Solution {
    public int heightChecker(int[] heights) {
        int[] count = new int[101];
        for (int h : heights) count[h]++;
        int mismatches = 0, cur = 1;               // cur = current expected height
        for (int h : heights) {
            while (count[cur] == 0) cur++;         // next height in sorted order
            if (h != cur) mismatches++;
            count[cur]--;
        }
        return mismatches;
    }
}
