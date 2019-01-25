import {IFragment, IMeta} from "../core/fragment";

export default class TestFragment implements IFragment {
    public readonly meta: IMeta = {
        name: "test",
        description: "A test fragment",
        author: "anonymous",
        version: "1.0.0"
    };
}
