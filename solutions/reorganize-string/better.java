class Solution {
    public String reorganizeString(String s) {
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) cnt[c - 'a']++;
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[0] - a[0]);   // (count, char)
        for (int c = 0; c < 26; c++) if (cnt[c] > 0) heap.offer(new int[]{cnt[c], c});
        StringBuilder sb = new StringBuilder();
        while (!heap.isEmpty()) {
            int[] first = heap.poll();
            if (sb.length() > 0 && sb.charAt(sb.length() - 1) == 'a' + first[1]) {
                if (heap.isEmpty()) return "";                // only the previous char is left
                int[] second = heap.poll();
                sb.append((char) ('a' + second[1]));
                if (--second[0] > 0) heap.offer(second);
                heap.offer(first);
            } else {
                sb.append((char) ('a' + first[1]));
                if (--first[0] > 0) heap.offer(first);
            }
        }
        return sb.toString();
    }
}
