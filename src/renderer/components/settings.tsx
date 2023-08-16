import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

export default function ShortcutMenu() {
    return (
        <Dialog>
            <DialogTrigger>
                <button>Open</button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Shortcuts</DialogTitle>
                    <DialogDescription>
                        Some shortcuts you can use
                    </DialogDescription>
                </DialogHeader>
                <ul>
                    <li>Ctrl + S: Save</li>
                    <li>Ctrl + Shift + S: Save As</li>
                    <li>Ctrl + O: Open</li>
                </ul>
            </DialogContent>
        </Dialog>
    )
}