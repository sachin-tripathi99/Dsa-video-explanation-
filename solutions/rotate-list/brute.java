class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null) return head;
        int n = 0;
        for (ListNode p = head; p != null; p = p.next) n++;
        for (int r = 0; r < k % n; r++) {                   // move the tail to the front
            ListNode p = head;
            while (p.next.next != null) p = p.next;
            p.next.next = head;
            head = p.next;
            p.next = null;
        }
        return head;
    }
}
