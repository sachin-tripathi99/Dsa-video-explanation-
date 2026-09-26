class Solution {
    public int leastInterval(char[] tasks, int n) {
        int[] cnt = new int[26];
        for (char t : tasks) cnt[t - 'A']++;
        PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());   // remaining counts
        for (int c : cnt) if (c > 0) heap.offer(c);
        int time = 0;
        while (!heap.isEmpty()) {
            List<Integer> used = new ArrayList<>();
            int slots = 0;
            while (slots < n + 1 && !heap.isEmpty()) {       // one cycle: n + 1 different tasks
                used.add(heap.poll() - 1);
                slots++;
            }
            for (int c : used) if (c > 0) heap.offer(c);
            time += heap.isEmpty() ? slots : n + 1;          // no trailing idle
        }
        return time;
    }
}
