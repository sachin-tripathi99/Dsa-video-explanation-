class MyCircularQueue {
    private final List<Integer> data = new ArrayList<>();
    private final int k;

    public MyCircularQueue(int k) { this.k = k; }
    public boolean enQueue(int value) { if (data.size() == k) return false; data.add(value); return true; }
    public boolean deQueue() { if (data.isEmpty()) return false; data.remove(0); return true; }   // shifts
    public int Front() { return data.isEmpty() ? -1 : data.get(0); }
    public int Rear() { return data.isEmpty() ? -1 : data.get(data.size() - 1); }
    public boolean isEmpty() { return data.isEmpty(); }
    public boolean isFull() { return data.size() == k; }
}
