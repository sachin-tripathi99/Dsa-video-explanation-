class Solution {
    public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        int n = profits.length;
        Integer[] idx = new Integer[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Integer.compare(capital[a], capital[b]));   // locked, by capital
        PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());   // unlocked profits
        int j = 0;
        for (int r = 0; r < k; r++) {
            while (j < n && capital[idx[j]] <= w) heap.offer(profits[idx[j++]]);
            if (heap.isEmpty()) break;
            w += heap.poll();
        }
        return w;
    }
}
