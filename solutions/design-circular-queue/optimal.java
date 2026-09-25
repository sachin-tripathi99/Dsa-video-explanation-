class MyCircularQueue {
    private final int[] a;
    private int head = 0, size = 0;

    public MyCircularQueue(int k) { a = new int[k]; }

    public boolean enQueue(int value) {
        if (size == a.length) return false;
        a[(head + size) % a.length] = value;     // next free slot, wrapping around
        size++;
        return true;
    }

    public boolean deQueue() {
        if (size == 0) return false;
        head = (head + 1) % a.length;
        size--;
        return true;
    }

    public int Front() { return size == 0 ? -1 : a[head]; }
    public int Rear() { return size == 0 ? -1 : a[(head + size - 1) % a.length]; }
    public boolean isEmpty() { return size == 0; }
    public boolean isFull() { return size == a.length; }
}
